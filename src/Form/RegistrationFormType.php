<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Notifier\Message\EmailMessage;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\EmailValidator;
use Symfony\Component\Validator\Constraints\IsFalse;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Regex;
use Symfony\Component\Validator\Constraints\Type;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email',EmailType::class,[
                'label'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter your email',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('password', PasswordType::class, [
                'mapped'=>false,
                'label'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter a password',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Your password must be at least {{limit}} digits',
                        'max' => 4096,
                        'maxMessage' =>'Your password is longer than {{limit}} digits'
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]

            ])
            ->add('name',TextType::class,[
                'label'=>false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter your first and last name',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('address',TextType::class,[
                'label'=>false,
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('studentNumber',NumberType::class,[
                'label'=>false,
                'invalid_message'=>'The student card number must be numeric',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter the student card number',
                    ]),
                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
            ->add('phone',NumberType::class,[
                'label'=>false,
                'invalid_message'=>'Phone number must be numeric',
                'constraints' => [
                    new Length([
                        'min' => 8,
                        'minMessage' => 'Phone number must be 8 digits',
                        'max' =>8,
                        'maxMessage' =>'Phone number must be 8 digits'
                    ]),

                ],
                'attr' => [
                    'class'=>'form-input',
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'csrf_protection' => true,
            'csrf_field_name' => '_token',
            'csrf_token_id'   => 'register_item',
        ]);
    }
}
